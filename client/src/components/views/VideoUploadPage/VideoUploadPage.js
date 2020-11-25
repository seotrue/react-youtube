import React ,{useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
const { Title } = Typography;
const { TextArea } = Input;
//import Dropzone from 'react-dropzone'

import { useSelector } from "react-redux";
import { FaUserSecret } from 'react-icons/fa';
import Axios from 'axios';

const Private = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]

function VideoUploadPage (props){
    // 스토어에 잇는 스테이트 값을 가져오는 방법(리더스 훅 )
    // 스토어에 잇는 유저의 값을 갖고 와서 유저변수에 담는다
    const user = useSelector(state=>state.user)
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0);
    const [Categories, setCategories] =  useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("")
    const [Thumbnail, setThumbnail] = useState("")

    const handleChangeTitle = (event) => {
        setTitle(event.currentTarget.value)
    }

    const handleChangeDecsription = (event) => {
        console.log(event.currentTarget.value)

        setDescription(event.currentTarget.value)
    }

    const handleChangeOne = (event) => {
        setPrivacy(event.currentTarget.value)
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }
    const onSubmit = (e) => {

    }

    // 파일을 갖고올할땨ㅐ
    const onDrop = (files) => {
        // 파일 포맷이 필요
        // 서버에 요청을 보낼때 같이 보내야지 요=오류가 안남
        let formDate = new formDate();
        const config = {
            header : { 'content-type' : 'multipart/form-data' }
        }
        // file은 올린 파일의 정보
        console.log(files)
        formDate.append('file',files[0])
        
        //서베에게 요청 보냄 (파일 정보와 파일 포맷해더를 같이 줌)
        Axios.post('/api/video/uploadfiles',formDate,config)
            .then(res=>{
                //서버에서 요청이 끝나면 결과값 res 를 줌
                if (response.data.success) {
                    // 썸네일 요청할때 줄 데이터를 변수에 담음
                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }

                    // 서버에서 업로드한 파일의 서버에 저장한 주소를 스테이트에 저장
                    setFilePath(response.data.filePath)

                    // 그리고 썸네일 요청
                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnail(response.data.thumbsFilePath)
                            } else {
                                alert('Failed to make the thumbnails');
                            }
                        })
                }

            })
        
    }
    
    const onSubmit = (e) => {
        e.preventDefault();
        // 비디오를 서버에 업로드 할때 서버에줄 값
        const variables = {
            // 유저 변수에 담긴 id 값을 writer값에 넣어서
            writer: user.userData._id,
            title: title, // 스테이트
            description: Description,
            privacy: privacy,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: Thumbnail
        }
        axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if (response.data.success) {
                alert('video Uploaded Successfully')
                props.history.push('/')
            } else {
                alert('Failed to upload video')
            }
        })
    }

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   {/* 드랍존 */}
                    {/* <Dropzone onDrop={onDrop}
                        multiple={false}
                        maxSize={80000000}
                    >
                    {}
                    </Dropzone> */}
                   {/* 썸네일존 */}
                   {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
                   <br/><br/>

                    <label>타이틀</label>
                    <Input onChange={handleChangeTitle} value={Title}/>
                    
                    <br/><br/>
                    
                    <label>Description</label>
                    <TextArea
                        onChange={handleChangeDecsription}
                        value={Description}
                    />

                    <br/><br/>          

                    <select onChange={handleChangeOne}>
                        {/* 맵에서{} 쓸땐 리턴을 해주거거나 방법 1. */}
                        {Private.map((v,i)=>{
                           return  <option key={i} value={v.value}>{v.value}</option>
                        })}
                    </select>

                    <br/><br/>
                    
                    <select onChange={handleChangeTwo}>
                         {/* 방법2. 아님 ()로 감싸준다. */}
                        {Catogory.map((v,i)=>(
                            <option key={i} value={v.label}>{v.label}</option>
                        ))}
                    </select>
                    
                    <br/><br/>
                    <button type='primary' size='large'>Submit</button>


                </div>
            </Form>
        </div>
    )
}

export default VideoUploadPage