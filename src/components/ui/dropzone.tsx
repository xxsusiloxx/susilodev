import { useDropzone } from 'react-dropzone';
import { ChangeEventHandler, FC } from 'react';

export const Dropzone: FC<{
  multiple?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ multiple, onChange, ...rest }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    ...rest,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps({ onChange })} />
    </div>
  );
};
