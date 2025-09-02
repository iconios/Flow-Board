export interface UserCreate {
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}