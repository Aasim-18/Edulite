export default function PageHeader({ eyebrow = 'Overview', title, description, actions }) {
  return (
    <div className="ui-page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="dashboard-description">{description}</p>}
      </div>
      {actions && <div className="ui-page-header-actions">{actions}</div>}
    </div>
  );
}
