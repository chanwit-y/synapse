import { SquarePen, Code, Plus, Trash2, CodeXml } from "lucide-react";
import { Colors } from ".";

export const menuFeatureIcon = [
  {
    icon: <CodeXml size={16} />,
    title: "Code",
    action: () => console.log("Code"),
    color: Colors.black,
    bgColor: Colors.lightgrey,
  },
  {
    icon: <SquarePen size={16} />,
    title: "Editor",
    action: () => console.log("Editor"),
    color: Colors.blue,
    bgColor: Colors.lightBlue,
  },
  {
    icon: <Plus size={16} />,
    title: "Add",
    action: () => console.log("Add"),
    color: Colors.green,
    bgColor: Colors.lightGreen,
  },
  {
    icon: <Trash2 size={16} />,
    title: "Delete",
    action: () => console.log("Delete"),
    color: Colors.red,
    bgColor: Colors.lightRed,
  },
];
