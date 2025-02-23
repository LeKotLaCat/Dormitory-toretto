import { ReactElement } from 'react';

//landing page

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  initial: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface HOW {
  icon: ReactElement;
  title: string;
  description: string;
}

export interface Team {
  name: string;
  studentId: string;
  role: string;
  githubUrl: string;
  email: string;
  imageUrl: string;
}

export type DormType = {
  id: string;
  title: string;
  description: string;
  price: number;
  building: 'new' | 'old';
  features?: string[];
  amenities?: string[];
};

//end of landing page