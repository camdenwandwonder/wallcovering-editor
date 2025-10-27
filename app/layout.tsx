export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="nl">
<body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</body>
</html>
);
}
