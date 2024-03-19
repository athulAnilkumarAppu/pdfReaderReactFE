
import { useEffect, useState } from "react";
import axios from "axios";

const PdfUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);

  const [pdfTextContent, setPdfContent] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    axios.post('https://pdfcontentreader-1.onrender.com/getLotteryResults', {},).then((response)=> {
      console.log(response)
    }).catch((error)=> {
      console.log(error)
    })  
  },[])


  useEffect(()=> {
    axios.post('http://localhost:3000/getLotteryResultsById', {id: 1},).then((response)=> {
      console.log(response)
    }).catch((error)=> {
      console.log(error)
    })  
  },[])

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    const reader = new FileReader();

    reader.onload = () => {
      setPdfFile(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const onUploadClick = async () => {
    setLoading(true)
    await axios
      .post("https://pdfcontentreader-1.onrender.com/pdfReader", { pdfBase64: pdfFile })
      .then((res) => {
        if (res) {
          setPdfContent(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(()=> {
        setLoading(false)
      })
  };

  return (
    <>
      <h1>Upload pdf</h1>

      <input type="file" onChange={(e) => handleFile(e)} />

      <button onClick={() => onUploadClick()}>Upload</button>


    {loading ? <p>Loading.....</p> :  
    <div style={{ border: '1' }} >
        <div>{`First Price: ${pdfTextContent.firstPrice ? pdfTextContent.firstPrice : 'not found'}`}</div>
        <div>{`Second Price: ${pdfTextContent.secondPrice ? pdfTextContent.secondPrice : 'not found'}`}</div>
        {pdfTextContent.thirdPrice ? 
        <div>
        <label>Third Price:</label>
          <ul>
          {pdfTextContent.thirdPrice?.length > 0 && pdfTextContent.thirdPrice.map((item, k)=> {
            return <li key={k}>{item}</li>
          })}
          </ul>
        </div>
        : 'not found'}
      </div>}

      
     
    </>
  );
};

export default PdfUpload;
