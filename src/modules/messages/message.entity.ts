import { User } from '../users/user.entity';

export class Message {
  id!: string;
  content?: string;
  imageUrl?: string;
  user!: User;
  createdAt!: Date;
  constructor(data: Message) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt);
    if (data.user != null) {
      this.user = new User(data.user);
    }
  }

  get dateString() {
    return this.createdAt.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  get datetimeString() {
    return this.createdAt.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
