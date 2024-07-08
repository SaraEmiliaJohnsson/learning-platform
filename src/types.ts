
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