import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import html2pdf from 'html2pdf.js';
import { Download, GripVertical, Plus } from 'lucide-react';

const initialSections = [
    { id: '1', type: 'personal', title: 'Personal Info' },
    { id: '2', type: 'education', title: 'Education' },
    { id: '3', type: 'experience', title: 'Experience' },
    { id: '4', type: 'skills', title: 'Skills' }
];

const ResumeBuilder = () => {
    const [sections, setSections] = useState(initialSections);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
    };

    const handleExport = () => {
        const element = document.getElementById('resume-preview');
        html2pdf().from(element).save('my-resume.pdf');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
            {/* Sidebar Editor */}
            <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
                    Builder Configuration
                    <button className="bg-primary/10 text-primary p-1 rounded hover:bg-primary hover:text-white transition">
                        <Plus className="w-5 h-5" />
                    </button>
                </h2>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="builder-sections">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex-1 overflow-y-auto space-y-3 pr-2"
                            >
                                {sections.map((sec, index) => (
                                    <Draggable key={sec.id} draggableId={sec.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm"
                                            >
                                                <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 transition cursor-grab">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>
                                                <div className="font-medium text-slate-700">{sec.title}</div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Live Preview Pane */}
            <div className="w-full lg:w-2/3 bg-slate-100 rounded-xl border border-slate-200 p-6 flex flex-col items-center overflow-y-auto shadow-inner relative">
                <div className="absolute top-6 right-6 z-10">
                    <button onClick={handleExport} className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded shadow hover:bg-slate-800 transition">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Export PDF</span>
                    </button>
                </div>

                <div id="resume-preview" className="bg-white w-full max-w-2xl min-h-[842px] p-12 shadow-md mx-auto print:shadow-none text-slate-800 font-sans mt-12">
                    {sections.map(sec => (
                        <div key={sec.id} className="mb-6">
                            <h3 className="text-lg font-bold border-b-2 border-slate-300 pb-1 mb-3 uppercase tracking-wider">{sec.title}</h3>
                            <div className="text-sm text-slate-600 space-y-2">
                                {sec.type === 'personal' && (
                                    <div>
                                        <div className="text-2xl font-black text-slate-900 mb-1">John Doe</div>
                                        <div>john.doe@example.com | (555) 123-4567 | github.com/johndoe</div>
                                    </div>
                                )}
                                {sec.type === 'experience' && (
                                    <div>
                                        <div className="flex justify-between font-bold text-slate-800">
                                            <span>Software Engineer at Google</span>
                                            <span>2020 - Present</span>
                                        </div>
                                        <ul className="list-disc list-inside mt-2 marker:text-slate-400">
                                            <li>Developed and maintained highly scalable microservices.</li>
                                            <li>Improved application performance by 30%.</li>
                                        </ul>
                                    </div>
                                )}
                                {sec.type === 'education' && (
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold text-slate-800">B.S. Computer Science</span> | MIT
                                        </div>
                                        <span className="font-bold text-slate-800">2016 - 2020</span>
                                    </div>
                                )}
                                {sec.type === 'skills' && (
                                    <div>JavaScript, React, Node.js, Express, MongoDB, AWS, Docker</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
