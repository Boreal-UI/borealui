import { expandClassMap } from "@/utils/propAliases";
import ToastProviderBase, { useToast } from "../ToastProviderBase";
import { ToastProviderProps } from "../ToastProvider.types";
import "./ToastProvider.scss";

const classes = {
  viewport: "toast_viewport",
  toast: "toast",
  content: "toast_content",
  title: "toast_title",
  message: "toast_message",
  dismissButton: "toast_dismiss_button",
  topRight: "toast_top_right",
  topLeft: "toast_top_left",
  topCenter: "toast_top_center",
  bottomRight: "toast_bottom_right",
  bottomLeft: "toast_bottom_left",
  bottomCenter: "toast_bottom_center",
  general: "toast_general",
  success: "toast_success",
  error: "toast_error",
  warning: "toast_warning",
  info: "toast_info",
  shadowNone: "toast_shadow-None",
  shadowLight: "toast_shadow-Light",
  shadowMedium: "toast_shadow-Medium",
  shadowStrong: "toast_shadow-Strong",
  shadowIntense: "toast_shadow-Intense",
  roundNone: "toast_round-None",
  roundSmall: "toast_round-Small",
  roundMedium: "toast_round-Medium",
  roundLarge: "toast_round-Large",
  roundFull: "toast_round-Full",
};

export { useToast };

export default function ToastProvider(props: ToastProviderProps) {
  return <ToastProviderBase {...props} classMap={expandClassMap(classes)} />;
}
