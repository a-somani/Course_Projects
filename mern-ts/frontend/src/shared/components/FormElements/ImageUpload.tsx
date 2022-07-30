import { useEffect, useRef, useState } from "react"
import Button from "./Button"

type ImageUploadProps = {
  id: string
  center: boolean
  onInput: (
    id: string,
    pickedFile: File | undefined,
    fileIsValid: boolean
  ) => void
  errorText: string
}

const ImageUpload = ({ id, center, onInput, errorText }: ImageUploadProps) => {
  const [file, setFile] = useState<File>()
  const [previewUrl, setPreviewUrl] = useState<string>()
  const [isValid, setIsValid] = useState(false)

  const filePickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) {
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string)
    }
    fileReader.readAsDataURL(file)
  }, [file])

  const pickImageHandler = () => {
    filePickerRef.current?.click()
  }

  const pickedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile
    let fileIsValid = isValid
    if (e.target.files && e.target.files!.length === 1) {
      pickedFile = e.target.files[0]
      setFile(pickedFile)
      setIsValid(true)
      fileIsValid = true
    } else {
      setIsValid(false)
    }
    onInput(id, pickedFile, fileIsValid)
  }

  return (
    <div className="form-control">
      <input
        type="file"
        id={id}
        ref={filePickerRef}
        onChange={pickedHandler}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
      />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  )
}

export default ImageUpload
