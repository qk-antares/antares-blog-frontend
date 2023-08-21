import React, {useState} from "react";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import UploadModal from "@/pages/User/Settings/components/Base/components/AvatarModal";

type AvatarViewProps = {
  avatar: string;
  onSave: (newAvatar: string) => void;
}
const AvatarView: React.FC<AvatarViewProps> = ({avatar, onSave}) => {
  const avatarClass = useEmotionCss(() => {
    return {
      position: 'relative',
      margin: '0 auto',
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      boxShadow: '0 0 4px #ccc',
      '.uploadIcon': {
        position: 'absolute',
        top: '0',
        right: '10px',
        fontSize: '1.4rem',
        padding: '0.5rem',
        background: 'rgba(222, 221, 221, 0.7)',
        borderRadius: '50%',
        border: '1px solid rgba(0, 0, 0, 0.2)',
      },
      '.mask': {
        opacity: '0',
        position: 'absolute',
        background: 'rgba(0,0,0,0.4)',
        cursor: 'pointer',
        transition: 'opacity 0.4s',
        '&:hover': {
          opacity: '1',
        },
        'i': {
          fontSize: '2rem',
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginLeft: '-1rem',
          marginTop: '-1rem',
          color: '#d6d6d6',
        }
      },
      'img, .mask': {
        width: '100%',
        height: '100%',
        maxWidth: '180px',
        borderRadius: '50%',
        overflow: 'hidden',
      }
    }
  });
  const [visible, setVisible] = useState(false);

  function modalOpen() {
    setVisible(true);
  }

  return (
    <>
      <div className={avatarClass} onClick={modalOpen} >
        <UploadOutlined className='uploadIcon'/>
        <div className='mask'>
          <PlusOutlined style={{fontSize: 40,margin: 60,color: 'white'}}/>
        </div>
        <img src={avatar}/>
      </div>
      <UploadModal
        visible={visible}
        onCancel={()=>{setVisible(false)}}
        onSave={onSave}
      />
    </>
  )
}

export default AvatarView
