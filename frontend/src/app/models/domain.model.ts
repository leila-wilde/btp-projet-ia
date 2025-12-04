export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  organizer: string;
  maxParticipants: number;
  participantCount: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  maxCapacity: number;
}

export interface EventRegistration {
  userId: string;
  eventId: string;
  registeredAt: Date;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  locked: boolean;
  creator: {
    id: string;
    username: string;
  };
  postCount: number;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface ForumPost {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  threadId: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateThreadRequest {
  title: string;
  content: string;
  category: string;
}

export interface CreatePostRequest {
  content: string;
  threadId: string;
}

export interface WorkshopProposal {
  id: string;
  title: string;
  description: string;
  proposerId: string;
  proposer: string;
  votesCount: number;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: Date;
  updatedAt: Date;
}
