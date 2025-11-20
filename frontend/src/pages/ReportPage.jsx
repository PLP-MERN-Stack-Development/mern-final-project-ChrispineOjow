import { Button } from "../components/ui/button";
import  ReportCard  from "../components/ReportCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react';
import { reportsAPI } from '../lib/api';
import { Spinner } from "@/components/ui/spinner";



const REPORTS_PER_PAGE = 5;

function ReportPage(){

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const handleAddReport = () => {
        navigate("/addReports");
    }

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        try {
            setLoading(true);
            setError(null);
            const data = await reportsAPI.getAll();
            const normalizedReports = Array.isArray(data)
                ? data
                : data?.reports || data?.data || [];
            setReports(normalizedReports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            if (filter === 'all') return true;
            if (filter === 'available') return report.waterAvailable;
            if (filter === 'unavailable') return !report.waterAvailable;
            if (filter === 'clean') return report.waterClean;
            if (filter === 'notClean') return !report.waterClean;
            if (filter === 'verified') return report.verified;
            return true;
        });
    }, [reports, filter]);

    const handleDeleteReport = async (reportId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this report?");
        if (!confirmDelete) return;
        try {
            setError(null);
            setDeletingId(reportId);
            await reportsAPI.delete(reportId);
            await loadReports();
            setCurrentPage(1);
        } catch (err) {
            setError(err.message || 'Failed to delete report');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditReport = (reportId) => {
        navigate(`/addReport?reportId=${reportId}`);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(filteredReports.length / REPORTS_PER_PAGE));
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [filteredReports.length, currentPage]);

    const totalPages = Math.max(1, Math.ceil(filteredReports.length / REPORTS_PER_PAGE));
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };


    
    if (loading) return <div className="flex justify-center items-center h-screen">
                            <Spinner className="size-12"/>
                        </div>;
    if (error) return <div>Error: {error}</div>;
    
    return(
        <>
        
            <div>

                <div className="flex m-5 justify-between items-center">
                    <h3 className="font-bold  text-3xl space-x-2">Water Reports</h3>
                    <Button className="space-x-7 p-6 bg-black text-white hover:cursor-pointer" onClick={handleAddReport}>
                        Add New Report
                    </Button>
                </div>

                <div className="flex justify-center   mb-10">
                    <h3 className="font-bold text-2xl">Filters:</h3>
                    <div className="flex justify-center flex-wrap  mb-10">
                    <Button className="bg-black text-white mx-5 hover:cursor-pointer my-4" onClick={() => handleFilterChange('all')}>All</Button>
                    <Button className="bg-black text-white mx-5 hover:cursor-pointer my-4" onClick={() => handleFilterChange('available')}>Available</Button>
                    <Button className="bg-black text-white mx-5 hover:cursor-pointer my-4" onClick={() => handleFilterChange('unavailable')}>Unavailable</Button>
                    <Button className="bg-black text-white mx-5 hover:cursor-pointer my-4" onClick={() => handleFilterChange('clean')}>Clean</Button>
                    <Button className="bg-black text-white mx-5 hover:cursor-pointer my-4" onClick={() => handleFilterChange('notClean')}>Not Clean</Button>
                    <Button className="bg-black text-white mx-5 hover:cursor-pointer my-4" onClick={() => handleFilterChange('verified')}>Verified Only</Button>
                    </div>
                </div>

            </div>


            <div className="flex justify-center">
                {filteredReports.length === 0 ? (
                    <p className="text-gray-500">No reports to display for this filter.</p>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        {paginatedReports.map((report) => {
                            const reportId = report._id || report.id;
                            return (
                                <ReportCard
                                    key={reportId}
                                    locationName={report.locationName}
                                    onEdit={() => handleEditReport(reportId)}
                                    onDelete={() => handleDeleteReport(reportId)}
                                    isDeleting={deletingId === reportId}
                                >
                                    <div className="space-y-2">
                                        
                                        <p className="text-sm text-gray-600">{report.description || 'No description provided.'}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Water Available:</span>{' '}
                                                {report.waterAvailable ? 'Yes' : 'No'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Water Clean:</span>{' '}
                                                {report.waterClean ? 'Yes' : 'No'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Verified:</span>{' '}
                                                {report.verified ? 'Yes' : 'No'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Reporter:</span>{' '}
                                                {report.userId.name || 'Unknown'}
                                            </div>
                                        </div>
                                        {report.createdAt && (
                                            <p className="text-xs text-gray-500">
                                                Submitted on {new Date(report.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </ReportCard>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-center mb-5">
                <Button
                    className="text-white bg-black me-6 hover:cursor-pointer disabled:opacity-50"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {filteredReports.length === 0 ? 0 : currentPage} of {filteredReports.length === 0 ? 0 : totalPages}</span>
                <Button
                    className="text-white bg-black ms-6 hover:cursor-pointer disabled:opacity-50"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || filteredReports.length === 0}
                >
                    Next
                </Button>
            </div>

        </>
    )
}

export default ReportPage;