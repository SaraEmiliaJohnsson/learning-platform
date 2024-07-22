
export interface Student {
    id: string;
    name: string;
    email: string;
}


export interface Course {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    students: string[];
    assignments: string[];
}

export interface Assignments {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    students: string[];
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    date: string;
}

export interface ReadingTip {
    id: string;
    title: string;
    description: string;
}

export interface LinkResource {
    id: string;
    title: string;
    url: string;
}

export interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: Date;
}

export interface Grade {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    courseId: string;
    grade: number;
    grades: { [key: string]: number };
}