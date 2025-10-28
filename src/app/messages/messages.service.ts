import {Injectable, signal} from "@angular/core";
import {Message, MessageSeverity} from "../models/message.model";


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messagesSignal = signal<Message[]>([]);
  messages = this.messagesSignal.asReadonly();

  showMessage(text: string, severity: MessageSeverity = 'info'): void {
    const message: Message = { text, severity };
    this.messagesSignal.update(messages => [...messages, message]);

    // Auto-remove message after 3 seconds
    setTimeout(() => {
      this.removeMessage(message);
    }, 3000);
  }

  removeMessage(messageToRemove: Message): void {
    this.messagesSignal.update(messages =>
      messages.filter(message => message !== messageToRemove)
    );
  }

  clearMessages(): void {
    this.messagesSignal.set([]);
  }
}
