import { Code } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"; 

export default function Markdown({ children }) {

    return (
        <ReactMarkdown
            className="code-area"
            components={{
                code({ node, inline, className, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <SyntaxHighlighter style={tomorrow} language={match[1].toLowerCase()} {...props} showLineNumbers={true} wrapLines={true} lineProps={{
                            style: {
                                wordBreak: "break-all",
                                whiteSpace: "pre-wrap"
                            }
                        }}>
                            {String(props.children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                        <Code className={className} {...props}>
                            {props.children}
                        </Code>
                    );
                }
            }}
        >
            {children}
        </ReactMarkdown>
    )
}