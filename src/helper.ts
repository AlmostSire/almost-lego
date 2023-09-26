import QRCode from "qrcode";
import axios from "axios";
import html2canvas from "html2canvas";
import { RespUploadData } from "./store/respTypes";
import { message } from "ant-design-vue";
import { saveAs } from "file-saver";
interface CheckCondition {
  format?: string[];
  // 使用多少 M 为单位
  size?: number;
}
type ErrorType = "size" | "format" | null;
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorType = null;
  if (!isValidFormat) {
    error = "format";
  }
  if (!isValidSize) {
    error = "size";
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  };
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, {
    format: ["image/jpeg", "image/png"],
    size: 1,
  });
  const { passed, error } = result;
  if (error === "format") {
    message.error("上传图片只能是 JPG/PNG 格式!");
  }
  if (error === "size") {
    message.error("上传图片大小不能超过 1Mb");
  }
  return passed;
};

export const getImgDemensions = (urlOrFile: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.src =
      typeof urlOrFile === "string"
        ? urlOrFile
        : URL.createObjectURL(urlOrFile);
    img.addEventListener("load", () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    });
    img.addEventListener("error", () => {
      reject(new Error("There was some problem with the image"));
    });
  });
};

export const getParentElement = (element: HTMLElement, className: string) => {
  let current = element;
  while (current) {
    if (current.classList && current.classList.contains(className)) {
      return current;
    } else {
      current = current.parentNode as HTMLElement;
    }
  }
  return null;
};

export const insertAt = <T>(arr: T[], index: number, newItem: T) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
};

export const uploadFile = async <R = any>(
  file: Blob,
  url = "/utils/upload",
  fileName = "screenshot.png"
) => {
  const newfile = file instanceof File ? file : new File([file], fileName);
  const formData = new FormData();
  console.log(newfile);
  formData.append(newfile.name, newfile);
  const { data } = await axios.post<R>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getCanvasBlob = (canvas: HTMLCanvasElement) => {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
};

export const takeScreenshotAndUpload = async (ele: HTMLElement) => {
  // get screenshot canvas
  const canvas = await html2canvas(ele, {
    width: 375,
    useCORS: true,
    scale: 1,
  });
  // transform canvas to blob
  const canvasBlob = await getCanvasBlob(canvas);
  if (canvasBlob) {
    // upload blob to server
    return await uploadFile<RespUploadData>(canvasBlob);
  }
};

export const generateQRCode = (id: string, url: string) => {
  const ele = document.getElementById(id) as HTMLCanvasElement;
  return QRCode.toCanvas(ele, url, { width: 100 });
};

export const copyToClipboard = (text: string) => {
  // create a fake textarea, set value to text
  const textarea = document.createElement("textarea");
  textarea.value = text;
  // define styles to be hidden
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  // append to body and select
  document.body.appendChild(textarea);
  textarea.select();
  // run execCommand in try/catch
  try {
    return document.execCommand("copy");
  } catch (e) {
    console.warn("copy failed", e);
  } finally {
    document.body.removeChild(textarea);
  }
};

export const objToQueryString = (obj: Record<string, any>) => {
  return Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");
};

export const downloadFile = (src: string, fileName = "default.png") => {
  // 创建链接
  const link = document.createElement("a");
  link.download = fileName;
  link.rel = "noopener";
  if (link.origin !== location.origin) {
    axios
      .get(src, { responseType: "blob" })
      .then((res) => {
        link.href = URL.createObjectURL(res.data);
        setTimeout(() => {
          link.dispatchEvent(new MouseEvent("click"));
          setTimeout(() => {
            URL.revokeObjectURL(link.href);
          }, 10000);
        });
      })
      .catch((error) => {
        console.log(error);
        link.target = "_blank";
        link.href = src;
        link.dispatchEvent(new MouseEvent("click"));
      });
  } else {
    // 设置链接属性
    link.href = src;
    // 触发事件
    link.dispatchEvent(new MouseEvent("click"));
  }
};

export const downloadImage = (url: string) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  saveAs(url, fileName);
};
