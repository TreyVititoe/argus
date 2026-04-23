import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  meta?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, meta }: PageHeaderProps) {
  return (
    <>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <div className={styles.h1Row}>
        <h1 className={styles.headline}>{title}</h1>
        {meta !== undefined && meta !== null && <div className={styles.h1Meta}>{meta}</div>}
      </div>
    </>
  );
}
