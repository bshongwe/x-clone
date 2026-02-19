export interface User {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  post: string;
  likes: string[];
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
}

export interface Notification {
  _id: string;
  from: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: "like" | "comment" | "follow";
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  createdAt: string;
}
