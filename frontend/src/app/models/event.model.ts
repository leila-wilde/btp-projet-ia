export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  imageUrl?: string;
  maxParticipants: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  organizer: {
    id: string;
    username: string;
  };
  participants: Array<{
    id: string;
    username: string;
  }>;
  createdAt: Date;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  maxParticipants?: number;
}
