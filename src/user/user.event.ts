export class UserEvent {
  email: string;
  socketId: string;

  constructor(email: string, socketId: string) {
    this.email = email;
    this.socketId = socketId;
  }
}

export class UserMessageEvent {
  message: string;
  senderId: string;
  receiverId: string;

  constructor(message: string, senderId: string, receiverId: string) {
    this.message = message;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }
}
