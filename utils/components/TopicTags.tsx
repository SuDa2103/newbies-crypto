import React from "react";

const TopicTags = ({
  tags
}: {
  tags: Array<{
    text: string;
    href?: string;
  }>;
}) => {
  return (
    <div className="tags-wrapper">
      <div className="tags">
        {tags.map(({ text, href }, index) => {
          if (href) {
            return (
              <a
                className="tag"
                target="_blank"
                href={href}
                rel="noopener noreferrer"
              >
                {text}
              </a>
            );
          }
          return (
            <span key={index} className="tag">
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TopicTags;
