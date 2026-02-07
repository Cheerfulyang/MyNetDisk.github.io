<div class="file-item ${item.type} ${item.hidden ? 'hidden' : ''}" 
        data-id="${item.id}" 
        data-type="${item.type}">
    <div class="file-icon ${iconClass}">
        <i class="fas ${icon}"></i>
    </div>
    <div class="file-name">${item.name}</div>

    <div class="file-actions">
        <span class="file-size">25kb</span>
        <span class="file-action-btn"><i class="fas fa-ellipsis-h"></i></span>
    </div>
</div>