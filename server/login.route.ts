import {Request, Response} from 'express';
import {authenticate} from "./db-data";




export function loginUser(req: Request, res: Response) {

  console.log("User login attempt ...");

  const {email, password} = req.body;

  console.log("Email:", email, "Password:", password);

  const user = authenticate(email, password);

  if (user) {
    console.log("Login successful for user:", user.email);
    res.status(200).json({
      id: user.id.toString(),
      email: user.email,
      pictureUrl: user.pictureUrl
    });
  }
  else {
    console.log("Login failed - user not found or incorrect password");
    res.sendStatus(403);
  }

}
