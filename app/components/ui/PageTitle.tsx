import React from 'react';

interface PageTitleProps {
  title?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className="padding-md text-heading-h1 text-neutral-inverse">
      {/* PageTitle Component placeholder - needs token refactoring */}
      {title && <h1>{title}</h1>}
    </div>
  );
};

export default PageTitle;