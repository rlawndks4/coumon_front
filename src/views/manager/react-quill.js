import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useRef } from "react";
import { uploadFileByManager } from "src/utils/api-manager";
import { base64toFile } from "src/utils/function";
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

const ReactQuillComponent = (props) => {

    const {
        value,
        setValue
    } = props;

    const quillRef = useRef(null);
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: '1' }, { header: '2' }, { font: [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                    ],
                    ['link', 'image', 'video'],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    ['clean'],
                ],
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [],
    );
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
        'color',
        'align',
    ]
    return (
        <>
            <ReactQuill
                className="max-height-editor"
                theme={'snow'}
                id={'content'}
                placeholder={''}
                value={value}
                modules={modules}
                formats={formats}
                ref={quillRef}
                onChange={async (e) => {
                    let note = e;
                    if (e.includes('<img src="') && e.includes('base64,')) {
                        let base64_list = e.split('<img src="');
                        for (var i = 0; i < base64_list.length; i++) {
                            if (base64_list[i].includes('base64,')) {
                                let img_src = base64_list[i];
                                img_src = await img_src.split(`"></p>`);
                                let base64 = img_src[0];
                                img_src = await base64toFile(img_src[0], 'note.png');
                                const response = await uploadFileByManager({
                                    file: img_src
                                });
                                note = await note.replace(base64, response?.url)
                            }
                        }
                    }
                    setValue(note);
                }} />
        </>
    )
}
export default ReactQuillComponent;