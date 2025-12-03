export type MovementType = "income" | "expense";
export type Movement = {
    id: number;
    date: string;
    description: string;
    amount: number;
    categoryId: Category["id"];
    type: MovementType;
};
export type Category = {
    id: number;
    name: string;
};
export type NewMovement = Omit<Movement, "id">;
