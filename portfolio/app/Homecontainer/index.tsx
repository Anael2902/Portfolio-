'use client';

import { useCallback } from 'react';
import TextComponent from "../Component/TextComponent";
import Image from "next/image";
import styles from "./styles.module.scss";

export default function HomeContainer() {
  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, []);

  const handleEmail = () => {
    window.location.href = 'mailto:anaeltla.ada@gmail.com'; // 👈 Ton email
  };

  return (
    <section className={styles.hero}>
      <div className={styles.hero_content}>
        <Image 
          src="/images/car.png"
          alt="Anaël Toula"
          width={450}
          height={600}
          priority
          sizes="(max-width: 768px) 80vw, 45vw"
          className={styles.hero_image}
        />
        
        <div className={styles.hero_text}>
          <TextComponent textType="h1" className={styles.hero_title}>
            Portfolio
          </TextComponent>
          <TextComponent
            textType="p"
            className={styles.hero_subtitle}
          >
            {"Hello I'm Anaël Toula, a full stack developer"}
          </TextComponent>
          
          <div className={styles.hero_buttons}>
            <button className={styles.hero_cta_secondary} onClick={handleEmail}>
              Contact Me ✉
            </button>
            <button className={styles.hero_cta} onClick={scrollToProjects}>
              Voir mes projets 
            </button>
          </div>
          
          <a href="https://www.instagram.com/anael_tla/" className={styles.hero_instagram}>
            <Image 
              src="/images/instaIcon.avif"
              alt="Instagram"
              width={24}
              height={24}
            />
             @anael_tla
          </a>
        </div>
      </div>
    </section>
  );
}