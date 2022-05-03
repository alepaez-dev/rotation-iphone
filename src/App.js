import './App.css';
import React, { useState, useEffect } from "react"
import loadImage from "blueimp-load-image"
import {useDropzone} from 'react-dropzone';

function App() {

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };
  
  const settingOfFiles = (setFiles, acceptedFiles) => 
    setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
    })))


const rotateAle = async (file) => {
  console.log("FIRST FILE", file)
  let promiseResult = await new Promise((resolve) => {
    loadImage(file, (img) => {
      img.toBlob(
        (blob) => {
          resolve(blob)
        },
        'image/jpeg'
      )
    }, { orientation: true, canvas: true },
    )
  })
  console.log("promiseResult", await promiseResult)
  return await promiseResult
}

  const [files, setFiles] = useState([]);


  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: async (files) => {
      const promises = []
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const promise = new Promise((resolve, reject) => {
            const image = new Image()
            let url = ""
            image.onload = function () {
                file.width = image.width
                file.height = image.height
                resolve(file)
            }
            url = URL.createObjectURL(file)
            image.src = url
        })
        promises.push(promise)
      }
      console.log("")
      return await Promise.all(promises)
    },
    validator: async (file) => {
      console.log("FILE", file)
      // onImageAdded(file)
      let prom = await new Promise(function (resolve, reject) {
        try {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject('Error: ', error);
            console.log("reader", reader)
        }
        catch (error) {
            return file.base64Image
        }
      })
      console.log("PROM", prom)
      let newProm = await new Promise((resolve) => {
        loadImage(prom, (img) => {
          img.toBlob(
            (blob) => {
              resolve(blob)
            },
            'image/jpeg'
          )
        }, { orientation: true, canvas: true }
        )
      })
      console.log("new Prom", newProm)
      Object.assign(file, {
        preview: URL.createObjectURL(newProm)
      })
      console.log("file already assigned", file)
      setFiles([file])
      // file.preview = URL.createObjectURL(file)
    }
    
  });



  const imageOnLoad = (file) => {
    // we release it
    URL.revokeObjectURL(file.preview)
  }
  // thumbs
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          alt=""
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => imageOnLoad(file)}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);




  return (
    <div className="App">
      <h1>PROYECTO ROTATION IMAGE ALE</h1>


      {/* Dropzone */}
      <section className="container">
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
      </section>
    </div>
  );
}

export default App;
