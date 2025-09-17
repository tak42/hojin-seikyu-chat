'use client';

import PdfAnnotationDemo from 'features/pdf/pdfCanvas';
import { PageLayout } from 'layouts/PageLayout';
import styles from './page.module.css';

export default function Home() {
  return (
    <PageLayout
      render={(user) => (
        <div className={styles.container}>
          <PdfAnnotationDemo />
        </div>
      )}
    />
  );
}
