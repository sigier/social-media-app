import { User } from "./user";

export interface Profile {
    username: string;
    diplayName: string;
    image?: string;
    bio?: string;
}

export class Profile implements Profile {

    constructor(user: User) {

        this.username = user.username; 
        this.diplayName = user.displayName;
        this.image = user.image;
    }

};