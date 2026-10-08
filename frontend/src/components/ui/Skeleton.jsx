export default function Skeleton({ className = '', width, height }) {
  const style = {
    ...(width ? { '--skeleton-width': width } : {}),
    ...(height ? { '--skeleton-height': height } : {}),
  };

  return <span aria-hidden="true" className={`ui-skeleton ${className}`.trim()} style={style} />;
}
