type Listener = () => void;

const forceLogoutListeners = new Set<Listener>();

export function onForceLogout(listener: Listener): () => void {
  forceLogoutListeners.add(listener);
  return () => {
    forceLogoutListeners.delete(listener);
  };
}

export function emitForceLogout(): void {
  for (const listener of forceLogoutListeners) {
    listener();
  }
}
