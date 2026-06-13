import { Children, cloneElement, isValidElement } from "react";
import { toTitleCaseText } from "@/lib/toTitleCase";

/**
 * @param {import('react').ReactNode} children
 * @returns {import('react').ReactNode}
 */
function mapTitleCaseChildren(children) {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return toTitleCaseText(child);
    }

    if (typeof child === "number") {
      return toTitleCaseText(String(child));
    }

    if (isValidElement(child) && child.props.children != null) {
      return cloneElement(child, child.props, mapTitleCaseChildren(child.props.children));
    }

    return child;
  });
}

/**
 * @param {{
 *   as?: keyof JSX.IntrinsicElements;
 *   children: import('react').ReactNode;
 * } & import('react').HTMLAttributes<HTMLElement>} props
 */
export default function TitleCaseHeading({ as: Component = "h2", children, ...props }) {
  return <Component {...props}>{mapTitleCaseChildren(children)}</Component>;
}
