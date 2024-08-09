
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
    assignments: Assignments[];
}

export interface Assignments {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    students: string[];
    responses: AssignmentResponse[];
}

export interface AssignmentResponse {
    studentId: string;
    response: string;
    submissionTimestamp: Date;
    graded: boolean;
    feedback?: string;
    grade?: 'IG' | 'G' | 'VG' | 'MVG';
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
    author: string;
    description: string;
}

export interface LinkResource {
    id: string;
    title: string;
    url: string;
}

export interface Message {
    id: string;
    title: string;
    body: string;
    sender: string;
    recipients: string[];
    read: boolean;
    timestamp: Date;
}

export interface Grade {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    courseId: string;
    grade: string;
    grades: { [studentId: string]: string };
}