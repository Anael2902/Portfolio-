import React, { ReactNode } from "react";

type TextType = "p" | "h1" | "h2" | "h3" | "span" | "div";
type TextAlign = "left" | "center" | "right" | "justify";

interface TextComponentProps {
  textType?: TextType;
  textAlign?: TextAlign;
  children?: ReactNode;
  className?: string;
}

export default function TextComponent({
  textType = "p",
  textAlign = "left",
  children,
  className = "",
}: TextComponentProps) {
  const Tag = textType;

  return (
    <Tag className={`text-${textAlign} ${className}`}>
      {children}
    </Tag>
  );
}
