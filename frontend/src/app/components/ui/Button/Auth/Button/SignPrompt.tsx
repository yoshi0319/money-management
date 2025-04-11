interface SignPromptProps {
  text: string;
  linkText: string;
  linkHref: string;
  className?: string;
}

export default function SignPrompt({ text, linkText, linkHref, className }: SignPromptProps) {
  return (
    <div className={className}>
      <p>{text}</p>
      <a href={linkHref} className="text-blue-500 hover:text-blue-700">{linkText}</a>
    </div>
  );
}