import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/test/', 'build/'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Stub figma:asset imports in tests
            'figma:asset/f590238576fefd9c24fb354a815dc45e601d2c26.png': path.resolve(__dirname, './src/test/__mocks__/stickerMock.ts'),
            'figma:asset/c7a06596eb83ed1af3024c4e3ccde7559dcb2b65.png': path.resolve(__dirname, './src/test/__mocks__/stickerMock.ts'),
            'figma:asset/2b85ea24917805b77812105a65efb729818ec50a.png': path.resolve(__dirname, './src/test/__mocks__/stickerMock.ts'),
            'figma:asset/2a4a3332fd0eaf2fa25bf3e61a7c19b31cef70cf.png': path.resolve(__dirname, './src/test/__mocks__/stickerMock.ts'),
            'figma:asset/03ae981efb3a0887fe17adf7f92c21bee98405f8.png': path.resolve(__dirname, './src/test/__mocks__/stickerMock.ts'),
        },
    },
});
