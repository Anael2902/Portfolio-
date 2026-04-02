import PersonalityGameContainer from "./Component/PassionGameContainer";
import HomeContainer from "./Homecontainer";
import ProjectContainer from "./ProjectContainer";

export default function page () {
  return(
       <>
      <HomeContainer />
      <ProjectContainer id="projects" />  
      <PersonalityGameContainer id="personality-game" />
    </>
  );
  
}