import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarDataUrl } from "@/utils/avatar";

const UserAvatar = (props) => {
  const { userName } = props;

  const dataAvatarUrl = generateAvatarDataUrl(userName);
  return (
    <Avatar>
      <AvatarImage src={dataAvatarUrl} alt={userName} />
      <AvatarFallback>{userName}</AvatarFallback>
    </Avatar>
  );
};

UserAvatar.propTypes = {
  dataAvatarUrl: String,
  userName: String,
};

export default UserAvatar;
