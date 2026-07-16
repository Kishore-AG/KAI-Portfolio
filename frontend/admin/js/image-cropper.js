export function openCropper(imageSrc, aspectRatio = 1) {
    return new Promise((resolve) => {
        let cropper;
        
        const modal = document.createElement("div");
        modal.className = "cropper-modal";
        
        modal.innerHTML = `
            <div class="kai-cropper-box"> 
                <div class="cropper-header">
                    <div class="header-content">
                        <div class="cropper-title">Upload and Edit image</div>
                        <div class="cropper-subtitle">
                            <button id="change-image-btn" class="edit-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                                Change Image
                            </button>
                            <span class="file-badge">ME.JPEG</span>
                        </div>
                    </div>
                    <button id="modal-close" class="close-icon-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div class="cropper-toolbar">
                    <button class="tool-btn" data-action="rotate-l" title="Rotate Left">↺</button>
                    <button class="tool-btn" data-action="rotate-r" title="Rotate Right">↻</button>
                    <button class="tool-btn" data-action="flip-h" title="Flip Horizontal">↔</button>
                    <button class="tool-btn" data-action="flip-v" title="Flip Vertical">↕</button>
                    <button class="tool-btn" data-action="zoom-out" title="Zoom Out">🔍-</button>
                    <button class="tool-btn" data-action="zoom-in" title="Zoom In">🔍+</button>
                    <button class="tool-btn" data-action="reset" title="Reset">⟲</button>
                </div>

                <div class="cropper-body">
                    <img id="cropper-image" src="${imageSrc}">
                </div>

                <div class="cropper-footer">
                    <button id="crop-save" class="btn-primary">Done</button>
                    <button id="crop-cancel" class="btn-secondary">Close</button>
                </div>
            </div>
        `;
        document.documentElement.appendChild(modal);

        const image = modal.querySelector("#cropper-image");

        const cleanupAndResolve = (result) => {
            if (cropper) cropper.destroy();
            modal.remove();
            document.removeEventListener("keydown", handleEsc);
            resolve(result);
        };

        image.style.display = "block";
        image.style.maxWidth = "100%";

        image.onload = () => {
            setTimeout(() => {
                cropper = new Cropper(image, {
                    aspectRatio,
                    viewMode: 1, 
                    dragMode: "move",
                    guides: true,
                    background: true,
                    center: true,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    wheelZoomRatio: 0.15,
                    autoCropArea: 0.8,
                    responsive: true,
                    movable: true,
                    zoomable: true,
                    scalable: true,
                    rotatable: true // FIXED: Must be true to allow toolbar rotation
                });
            }, 50); 
        };

        // Handle Toolbar Actions
        modal.querySelectorAll(".tool-btn").forEach(btn => {
            btn.onclick = (e) => {
                if (!cropper) return;
                const action = e.currentTarget.dataset.action;
                
                if (action === "rotate-l") cropper.rotate(-45);
                if (action === "rotate-r") cropper.rotate(45);
                if (action === "flip-h") cropper.scaleX(cropper.getData().scaleX === -1 ? 1 : -1);
                if (action === "flip-v") cropper.scaleY(cropper.getData().scaleY === -1 ? 1 : -1);
                if (action === "zoom-in") cropper.zoom(0.1);
                if (action === "zoom-out") cropper.zoom(-0.1);
                if (action === "reset") cropper.reset();
            };
        });

        modal.querySelector("#crop-cancel").onclick = () => cleanupAndResolve(null);
        modal.querySelector("#modal-close").onclick = () => cleanupAndResolve(null);

        const handleEsc = (e) => {
            if (e.key === "Escape") cleanupAndResolve(null);
        };
        document.addEventListener("keydown", handleEsc);

        modal.querySelector("#crop-save").onclick = () => {
            if (!cropper) return;
            const width = aspectRatio === 1 ? 600 : 1280;
            const height = aspectRatio === 1 ? 600 : 720;

            cropper.getCroppedCanvas({ width, height }).toBlob(blob => {
                cleanupAndResolve(blob);
            });
        };
    });
}