import { useThemedColors } from "@/hooks/useThemedColors";
import {
  ChevronRight,
  User,
  SquareArrowUpRight,
  ExternalLink,
  X,
  Image,
} from "lucide-react-native";

interface IconProps {
  name?:
    | "chevron-right"
    | "user"
    | "square-arrow-out-up-right"
    | "external-link"
    | "x"
    | "image"
  color?: string;
  size?: number;
}

const iconMap = {
  "chevron-right": ChevronRight,
  user: User,
  "square-arrow-out-up-right": SquareArrowUpRight,
  "external-link": ExternalLink,
  "x": X,
  "image": Image
};

export default function Icon({
  name = "chevron-right",
  color,
  size = 24,
}: IconProps) {
  const colors = useThemedColors();
  const SelectedIcon = iconMap[name];

  return <SelectedIcon color={colors.text} size={size} />;
}
