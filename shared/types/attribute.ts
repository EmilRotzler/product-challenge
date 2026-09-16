export type Attribute = {
  id: number;
  name: string;
  type: "text" | "number" | "boolean" | "select";
  options?: string[];
};
