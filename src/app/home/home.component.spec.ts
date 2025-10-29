import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { courseStore } from '../services/course.store';
import { Course } from '../models/course.model';
import { of, Subject } from 'rxjs';
import { signal } from '@angular/core';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { EditCourseDialogData } from '../edit-course-dialog/edit-course-dialog.data.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditCourseDialogComponent>>;
  let mockCourseStore: any;

  // Test data
  const mockBeginnerCourse: Course = {
    id: '1',
    title: 'Angular Beginner Course',
    longDescription: 'Complete Angular beginner guide',
    seqNo: 1,
    iconUrl: 'https://example.com/icon1.png',
    price: 50,
    uploadedImageUrl: 'https://example.com/image1.png',
    courseListIcon: 'icon1',
    category: 'BEGINNER',
    lessonsCount: 10
  };

  const mockAdvancedCourse: Course = {
    id: '2',
    title: 'Angular Advanced Course',
    longDescription: 'Master advanced Angular concepts',
    seqNo: 2,
    iconUrl: 'https://example.com/icon2.png',
    price: 100,
    uploadedImageUrl: 'https://example.com/image2.png',
    courseListIcon: 'icon2',
    category: 'ADVANCED',
    lessonsCount: 20
  };

  const mockCourses = [mockBeginnerCourse, mockAdvancedCourse];

  beforeEach(async () => {
    // Create mock dialog reference
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);

    // Create mock MatDialog
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue(mockDialogRef);

    // Create mock course store with signal-based state
    mockCourseStore = {
      courses: signal(mockCourses),
      selectedCourse: signal(null),
      error: signal(null),
      beginnersCourses: signal([mockBeginnerCourse]),
      advancedCourses: signal([mockAdvancedCourse]),
      loadCourses: jasmine.createSpy('loadCourses'),
      createCourse: jasmine.createSpy('createCourse'),
      updateCourse: jasmine.createSpy('updateCourse')
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(HomeComponent, {
      remove: {
        providers: [courseStore]
      },
      add: {
        providers: [{ provide: courseStore, useValue: mockCourseStore }]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should inject courseStore correctly', () => {
      expect(component.courseStore).toBeDefined();
      expect(component.courseStore).toBe(mockCourseStore);
    });

    it('should inject MatDialog correctly', () => {
      expect(component.modalDialog).toBeDefined();
      expect(component.modalDialog).toBe(mockDialog);
    });

    it('should initialize beginnerCourses from courseStore', () => {
      expect(component.beginnerCourses).toBeDefined();
      expect(component.beginnerCourses()).toEqual([mockBeginnerCourse]);
    });

    it('should initialize advancedCourses from courseStore', () => {
      expect(component.advancedCourses).toBeDefined();
      expect(component.advancedCourses()).toEqual([mockAdvancedCourse]);
    });
  });

  describe('onAddCourse()', () => {
    it('should call openCreateDialog when onAddCourse is invoked', () => {
      // Arrange
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());

      // Act
      component.onAddCourse();

      // Assert
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it('should open dialog with correct configuration for create mode', () => {
      // Arrange
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());

      // Act
      component.onAddCourse();

      // Assert
      expect(mockDialog.open).toHaveBeenCalledWith(
        EditCourseDialogComponent,
        jasmine.objectContaining({
          disableClose: true,
          autoFocus: true,
          data: {
            mode: 'create',
            title: 'Create New Course'
          }
        })
      );
    });

    it('should call courseStore.createCourse when dialog returns a result', (done) => {
      // Arrange
      const dialogResult = {
        title: 'New Course',
        description: 'New course description',
        category: 'BEGINNER',
        iconUrl: 'https://example.com/new-icon.png'
      };
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));

      // Act
      component.onAddCourse();

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.createCourse).toHaveBeenCalledWith({
          title: 'New Course',
          longDescription: 'New course description',
          category: 'BEGINNER',
          iconUrl: 'https://example.com/new-icon.png'
        });
        done();
      });
    });

    it('should not call courseStore.createCourse when dialog is cancelled', (done) => {
      // Arrange
      mockDialogRef.afterClosed.and.returnValue(of(null));

      // Act
      component.onAddCourse();

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.createCourse).not.toHaveBeenCalled();
        done();
      });
    });

    it('should not call courseStore.createCourse when dialog returns undefined', (done) => {
      // Arrange
      mockDialogRef.afterClosed.and.returnValue(of(undefined));

      // Act
      component.onAddCourse();

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.createCourse).not.toHaveBeenCalled();
        done();
      });
    });

    it('should map dialog result fields correctly to Course model', (done) => {
      // Arrange
      const dialogResult = {
        title: 'Test Title',
        description: 'Test Description',
        category: 'ADVANCED',
        iconUrl: 'https://test.com/icon.png'
      };
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));

      // Act
      component.onAddCourse();

      // Assert - Wait for async subscription
      setTimeout(() => {
        const expectedCourse: Partial<Course> = {
          title: 'Test Title',
          longDescription: 'Test Description',
          category: 'ADVANCED',
          iconUrl: 'https://test.com/icon.png'
        };
        expect(mockCourseStore.createCourse).toHaveBeenCalledWith(expectedCourse);
        done();
      });
    });
  });

  describe('onEditCourse()', () => {
    it('should call openEditDialog when onEditCourse is invoked', () => {
      // Arrange
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());

      // Act
      component.onEditCourse(mockBeginnerCourse);

      // Assert
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it('should open dialog with correct configuration for update mode', () => {
      // Arrange
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());

      // Act
      component.onEditCourse(mockBeginnerCourse);

      // Assert
      expect(mockDialog.open).toHaveBeenCalledWith(
        EditCourseDialogComponent,
        jasmine.objectContaining({
          disableClose: true,
          autoFocus: true,
          data: {
            mode: 'update',
            title: 'Update Course',
            course: mockBeginnerCourse
          }
        })
      );
    });

    it('should call courseStore.updateCourse when dialog returns a result', (done) => {
      // Arrange
      const dialogResult = {
        title: 'Updated Title',
        description: 'Updated description',
        category: 'ADVANCED',
        iconUrl: 'https://example.com/updated-icon.png'
      };
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));

      // Act
      component.onEditCourse(mockBeginnerCourse);

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.updateCourse).toHaveBeenCalledWith({
          courseId: mockBeginnerCourse.id,
          changes: {
            title: 'Updated Title',
            longDescription: 'Updated description',
            category: 'ADVANCED',
            iconUrl: 'https://example.com/updated-icon.png'
          }
        });
        done();
      });
    });

    it('should not call courseStore.updateCourse when dialog is cancelled', (done) => {
      // Arrange
      mockDialogRef.afterClosed.and.returnValue(of(null));

      // Act
      component.onEditCourse(mockBeginnerCourse);

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.updateCourse).not.toHaveBeenCalled();
        done();
      });
    });

    it('should not call courseStore.updateCourse when dialog returns undefined', (done) => {
      // Arrange
      mockDialogRef.afterClosed.and.returnValue(of(undefined));

      // Act
      component.onEditCourse(mockBeginnerCourse);

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.updateCourse).not.toHaveBeenCalled();
        done();
      });
    });

    it('should pass the correct course to the dialog', () => {
      // Arrange
      mockDialogRef.afterClosed.and.returnValue(of(null));

      // Act
      component.onEditCourse(mockAdvancedCourse);

      // Assert
      const callArgs = mockDialog.open.calls.mostRecent().args;
      const config = callArgs[1] as any;
      expect(config?.data?.course).toBe(mockAdvancedCourse);
    });

    it('should use the original course id for the update operation', (done) => {
      // Arrange
      const dialogResult = {
        title: 'New Title',
        description: 'New Description',
        category: 'BEGINNER',
        iconUrl: 'https://new.com/icon.png'
      };
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));

      // Act
      component.onEditCourse(mockAdvancedCourse);

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.updateCourse).toHaveBeenCalledWith(
          jasmine.objectContaining({
            courseId: mockAdvancedCourse.id
          })
        );
        done();
      });
    });
  });

  describe('onViewCourse()', () => {
    it('should call openViewDialog when onViewCourse is invoked', () => {
      // Act
      component.onViewCourse(mockBeginnerCourse);

      // Assert
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it('should open dialog with correct configuration for view mode', () => {
      // Act
      component.onViewCourse(mockBeginnerCourse);

      // Assert
      expect(mockDialog.open).toHaveBeenCalledWith(
        EditCourseDialogComponent,
        jasmine.objectContaining({
          disableClose: false,
          autoFocus: true,
          data: {
            mode: 'view',
            title: 'View Course',
            course: mockBeginnerCourse
          }
        })
      );
    });

    it('should have disableClose set to false for view mode', () => {
      // Act
      component.onViewCourse(mockBeginnerCourse);

      // Assert
      const callArgs = mockDialog.open.calls.mostRecent().args;
      const config = callArgs[1] as any;
      expect(config?.disableClose).toBe(false);
    });

    it('should pass the correct course to the view dialog', () => {
      // Act
      component.onViewCourse(mockAdvancedCourse);

      // Assert
      const callArgs = mockDialog.open.calls.mostRecent().args;
      const config = callArgs[1] as any;
      expect(config?.data?.course).toBe(mockAdvancedCourse);
    });

    it('should not call courseStore methods after opening view dialog', () => {
      // Act
      component.onViewCourse(mockBeginnerCourse);

      // Assert
      expect(mockCourseStore.createCourse).not.toHaveBeenCalled();
      expect(mockCourseStore.updateCourse).not.toHaveBeenCalled();
    });

    it('should not subscribe to afterClosed for view mode', () => {
      // Arrange
      const afterClosedSpy = jasmine.createSpy('afterClosed');
      mockDialogRef.afterClosed = afterClosedSpy;

      // Act
      component.onViewCourse(mockBeginnerCourse);

      // Assert - afterClosed should not be called since view mode doesn't subscribe
      expect(afterClosedSpy).not.toHaveBeenCalled();
    });
  });

  describe('Dialog Configuration Differences', () => {
    beforeEach(() => {
      mockDialogRef.afterClosed.and.returnValue(of(null));
    });

    it('should set disableClose to true for create mode', () => {
      // Act
      component.onAddCourse();

      // Assert
      const config = mockDialog.open.calls.mostRecent().args[1] as any;
      expect(config?.disableClose).toBe(true);
    });

    it('should set disableClose to true for edit mode', () => {
      // Act
      component.onEditCourse(mockBeginnerCourse);

      // Assert
      const config = mockDialog.open.calls.mostRecent().args[1] as any;
      expect(config?.disableClose).toBe(true);
    });

    it('should set disableClose to false for view mode', () => {
      // Act
      component.onViewCourse(mockBeginnerCourse);

      // Assert
      const config = mockDialog.open.calls.mostRecent().args[1] as any;
      expect(config?.disableClose).toBe(false);
    });

    it('should set autoFocus to true for all dialog modes', () => {
      // Act & Assert - Create mode
      component.onAddCourse();
      expect((mockDialog.open.calls.mostRecent().args[1] as any)?.autoFocus).toBe(true);

      mockDialog.open.calls.reset();

      // Act & Assert - Edit mode
      component.onEditCourse(mockBeginnerCourse);
      expect((mockDialog.open.calls.mostRecent().args[1] as any)?.autoFocus).toBe(true);

      mockDialog.open.calls.reset();

      // Act & Assert - View mode
      component.onViewCourse(mockBeginnerCourse);
      expect((mockDialog.open.calls.mostRecent().args[1] as any)?.autoFocus).toBe(true);
    });
  });

  describe('Signal Store Integration', () => {
    it('should access beginnerCourses from courseStore', () => {
      // The component's beginnerCourses is a reference to the store's signal
      // Verify it returns the same reference
      expect(component.beginnerCourses).toBe(mockCourseStore.beginnersCourses);
      expect(component.beginnerCourses()).toEqual([mockBeginnerCourse]);
    });

    it('should access advancedCourses from courseStore', () => {
      // The component's advancedCourses is a reference to the store's signal
      // Verify it returns the same reference
      expect(component.advancedCourses).toBe(mockCourseStore.advancedCourses);
      expect(component.advancedCourses()).toEqual([mockAdvancedCourse]);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle dialog returning empty string values', (done) => {
      // Arrange
      const dialogResult = {
        title: '',
        description: '',
        category: 'BEGINNER',
        iconUrl: ''
      };
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));

      // Act
      component.onAddCourse();

      // Assert - Wait for async subscription
      setTimeout(() => {
        expect(mockCourseStore.createCourse).toHaveBeenCalledWith({
          title: '',
          longDescription: '',
          category: 'BEGINNER',
          iconUrl: ''
        });
        done();
      });
    });

    it('should handle multiple rapid dialog operations', () => {
      // Arrange
      mockDialogRef.afterClosed.and.returnValue(of(null));

      // Act
      component.onAddCourse();
      component.onEditCourse(mockBeginnerCourse);
      component.onViewCourse(mockAdvancedCourse);

      // Assert
      expect(mockDialog.open).toHaveBeenCalledTimes(3);
    });

    it('should handle course with minimal data', () => {
      // Arrange
      const minimalCourse: Course = {
        id: '999',
        title: 'Minimal',
        longDescription: 'Min',
        seqNo: 999,
        iconUrl: '',
        price: 0,
        uploadedImageUrl: '',
        courseListIcon: '',
        category: 'BEGINNER',
        lessonsCount: 0
      };
      mockDialogRef.afterClosed.and.returnValue(of(null));

      // Act
      component.onEditCourse(minimalCourse);

      // Assert
      expect(mockDialog.open).toHaveBeenCalledWith(
        EditCourseDialogComponent,
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            course: minimalCourse
          })
        })
      );
    });

    it('should handle empty beginnerCourses signal', () => {
      // Arrange
      mockCourseStore.beginnersCourses.set([]);
      fixture.detectChanges();

      // Assert
      expect(component.beginnerCourses()).toEqual([]);
    });

    it('should handle empty advancedCourses signal', () => {
      // Arrange
      mockCourseStore.advancedCourses.set([]);
      fixture.detectChanges();

      // Assert
      expect(component.advancedCourses()).toEqual([]);
    });
  });
});
