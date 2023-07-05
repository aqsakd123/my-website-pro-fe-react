export default function CustomImage({ src, style, onClick, ...restProps}) {
    return (
        <img
            src={src}
            style={{ cursor: onClick ? 'pointer' : 'auto', ...style }}
            onClick={onClick}
            {...restProps}
        />
    );
}