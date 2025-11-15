export const isActive = (path: string, currentPath: string) => {
    if (path === '/') return path.replaceAll('/', '') === currentPath.replaceAll('/', '')
    return currentPath.replaceAll('/', '').includes(path.replaceAll('/', ''))
}

