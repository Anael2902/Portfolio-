"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import styles from "./styles.module.scss";

interface ProjectContainerProps {
  id?: string;
}

interface ProjectData {
  image: string;
  link: string;
  title: string;
  tag: string;
  description: string;
  index: string;
}

const projects: ProjectData[] = [
  {
    image: "/images/logo.jpg",
    link: "https://r-l-xi.vercel.app",
    title: "Rythme & Lasaï",
    tag: "Site vitrine",
    description: "Site vitrine pour prof de danse, simple et élégant avec une navigation fluide coulissée.",
    index: "01",
  },
  {
    image: "/videos/VideoSiteYunitto.mp4",
    link: "https://yunitto.fr/",
    title: "Yunitto",
    tag: "Web-entreprise",
    description: "Plateforme moderne site pour une entreprise avec une expérience utilisateur soignée et des performances optimales.",
    index: "02",
  },
  {
    image: "/images/plili.png",
    link: "https://portfolio-lili.vercel.app",
    title: "Portfolio Lili",
    tag: "Portfolio",
    description: "Portfolio personnel simple et intuitif.",
    index: "03",
  },
];

const ProjectContainer: React.FC<ProjectContainerProps> = ({ id }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;

    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseLeaveTrack = () => {
    isDragging.current = false;

    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;

    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMoveTrack = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.4;
  };

  const scrollGallery = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const handleCardMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    project: ProjectData
  ) => {
    setHoveredProject(project);
    setPreviewVisible(true);
    setPreviewPosition({
      x: e.clientX + 24,
      y: e.clientY - 120,
    });
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPreviewPosition({
      x: e.clientX + 24,
      y: e.clientY - 120,
    });
  };

  const handleCardMouseLeave = () => {
    setPreviewVisible(false);
    setHoveredProject(null);

    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  };

  return (
    <section id={id} className={styles.project_container}>
      <div className={styles.project_header}>
        <div className={styles.project_header_left}>
          <span className={styles.project_eyebrow}>Selected Works</span>
          <h2 className={styles.project_title}>Mes Projets</h2>
        </div>

        <div className={styles.project_header_right}>
          <span className={styles.project_total}>
            {String(projects.length).padStart(2, "0")} projets
          </span>

          <div className={styles.project_nav}>
            <button
              className={styles.nav_btn}
              onClick={() => scrollGallery(-1)}
              aria-label="Précédent"
              type="button"
            >
              ←
            </button>
            <button
              className={styles.nav_btn}
              onClick={() => scrollGallery(1)}
              aria-label="Suivant"
              type="button"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={styles.project_track}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveTrack}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMoveTrack}
      >
        {projects.map((project, i) => (
          <div
            key={project.link}
            className={`${styles.project_card} ${activeIndex === i ? styles.active : ""}`}
            onClick={() => setActiveIndex(i)}
            onMouseEnter={(e) => handleCardMouseEnter(e, project)}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className={styles.card_media}>
              {project.image.endsWith(".mp4") ? (
                <video
                  src={project.image}
                  className={styles.card_video}
                  muted
                  loop
                  playsInline
                  autoPlay={activeIndex === i}
                />
              ) : (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  quality={85}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 420px"
                  className={styles.card_image}
                />
              )}
              <div className={styles.card_overlay} />
            </div>

            <div className={styles.card_meta_top}>
              <span className={styles.card_index}>{project.index}</span>
              <span className={styles.card_tag}>{project.tag}</span>
            </div>

            <div className={styles.card_content}>
              <h3 className={styles.card_title}>{project.title}</h3>
              <p className={styles.card_desc}>{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card_link}
                onClick={(e) => e.stopPropagation()}
              >
                Voir le projet
                <span className={styles.card_arrow}>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.project_dots}>
        {projects.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${activeIndex === i ? styles.dot_active : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Projet ${i + 1}`}
            type="button"
          />
        ))}
      </div>

      <div
        className={`${styles.project_preview} ${previewVisible ? styles.project_preview_visible : ""}`}
        style={{
          left: `${previewPosition.x}px`,
          top: `${previewPosition.y}px`,
        }}
      >
        {hoveredProject && (
          <>
            {hoveredProject.image.endsWith(".mp4") ? (
              <video
                ref={previewVideoRef}
                src={hoveredProject.image}
                className={styles.project_preview_media}
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={hoveredProject.image}
                alt={hoveredProject.title}
                fill
                quality={85}
                sizes="320px"
                className={styles.project_preview_media}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectContainer;