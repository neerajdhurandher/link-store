import React, { useState } from 'react';
import { saveLink } from '../utils/firebase';

const AddLink = ({ onClose }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [accessLink, setAccessLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [files, setFiles] = useState([]);
    const [otherLinks, setOtherLinks] = useState([]);
    const validFileFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'application/pdf'];

    const handleFileDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        const validFiles = droppedFiles.filter((file) =>
            validFileFormats.includes(file.type)
        );
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    };

    const handleAddOtherLink = () => {
        setOtherLinks([...otherLinks, { placeholder: '', link: '' }]);
    };

    const handleOtherLinkChange = (index, field, value) => {
        const updatedLinks = [...otherLinks];
        updatedLinks[index][field] = value;
        setOtherLinks(updatedLinks);
    };

    const handleRemoveOtherLink = (index) => {
        const updatedLinks = otherLinks.filter((_, i) => i !== index);
        setOtherLinks(updatedLinks);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const otherLinksData = otherLinks.map((link, index) => ({
            sequenceNumber: index + 1,
            placeholder: link.placeholder,
            link: link.link,
        }));

        var result = await saveLink(
            projectName,
            projectDescription,
            accessLink,
            githubLink,
            otherLinksData,
            files
        );

        if (result) {
            console.log('Link saved successfully');
            // Reset form fields
            setProjectName('');
            setProjectDescription('');
            setAccessLink('');
            setGithubLink('');
            setFiles([]);
            setOtherLinks([]);
            // Close the popup
            onClose();
        } else {
            console.log('Error saving link');
            alert('Error saving link. Please try again.');
        }

    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="popup-header">
                    <h2>Add Link</h2>
                    <span className="close-icon" onClick={onClose}>&times;</span>
                </div>
                <form onSubmit={handleSubmit} className="add-link-form">
                    <label>
                        Project Name (required):
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Project Description (required):
                        <textarea
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Access Link (required):
                        <input
                            type="url"
                            value={accessLink}
                            onChange={(e) => setAccessLink(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        GitHub Link (required):
                        <input
                            type="url"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            required
                        />
                    </label>
                    <div className="other-links">
                        <div className="other-links-list">
                            {otherLinks.map((link, index) => (
                                <div key={index} className="other-link-item-wrapper">
                                    <span
                                        className="remove-icon"
                                        onClick={() => handleRemoveOtherLink(index)}
                                    >
                                        &minus;
                                    </span>
                                    <div className="other-link-item">
                                        <label>
                                            Other Link Name {index + 1}:
                                            <input
                                                type="text"
                                                placeholder="Link Placeholder"
                                                value={link.placeholder}
                                                onChange={(e) => handleOtherLinkChange(index, 'placeholder', e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Other Link {index + 1}:
                                            <input
                                                type="url"
                                                placeholder="Link URL"
                                                value={link.link}
                                                onChange={(e) => handleOtherLinkChange(index, 'link', e.target.value)}
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            id="add-other-link-button"
                            type="button"
                            className="add-other-link-button"
                            onClick={handleAddOtherLink}
                        >
                            Add Other Links
                        </button>
                    </div>
                    <label className="file-upload">
                        File Upload (optional):
                        <div
                            className="file-drop-area"
                            onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <span>Drag & drop your file here or click to upload 📁</span>
                            <p className="file-instructions">
                                Supported formats: PNG, JPEG, JPG, PDF
                            </p>
                            <div className="file-list">
                                {files.length > 0 ? (
                                    files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            {file.name}
                                            <span
                                                className="remove-icon"
                                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                            >
                                                &times;
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No files selected</p>
                                )}
                            </div>
                            <input
                                type="file"
                                onChange={(e) => setFiles((prevFiles) => [
                                    ...prevFiles,
                                    ...Array.from(e.target.files).filter((file) =>
                                        validFileFormats.includes(file.type)
                                    ),
                                ])}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </label>
                    <button type="submit" className="save-button">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AddLink;