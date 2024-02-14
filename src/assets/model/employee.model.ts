export interface Employee{
    empId: string;
    jobTitle: string;
    name: string;
    age: number;
    startDate: string;
    endDate: string;
    isCurrentlyWorking: boolean;
    edit: boolean

}

export interface JobTitle {
    id: number;
    jobTitle: string;
}