import PersonalityGameContainer from "./PassionGameContainer";
import HomeContainer from "./Homecontainer";
import ProjectContainer from "./ProjectContainer";
import ProfileContainer from "./ProfileContainer";

export default function page () {
  return(
       <>
      <HomeContainer />
      <ProjectContainer id="projects" />  
      <ProfileContainer />
      <PersonalityGameContainer id="personality-game" />
    </>
  );
  
}