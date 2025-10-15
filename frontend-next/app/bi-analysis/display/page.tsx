"use client";

import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import React, { useState, useCallback, useRef, useEffect, useMemo, useContext } from 'react';
import { checkTable, deleteCSVData, getDashboardDisplayCards, getDisplayTableData, uploadCSVData } from "@/utilities/axiosRequester";
import { crmCardsData } from "@/lib/constants";
import { AuthContext } from "@/context/AuthContext";
import { authenticatePageUseEffect } from "@/utilities/authenticatePageUseEffect";
import { useRouter } from "next/navigation";
import CheckingUserCard from "@/components/CheckingUserCard";

const MAX_VISIBLE_PAGE_NUMBERS = 5; // Max 5 page numbers (e.g., 1 ... 3 4 5 ... 10)
const ITEMS_PER_PAGE = 10; // Number of items to display per page

const getPaginationPages = (currentPage: number, lastPage: number) => {
  const pages: (number | string)[] = [];

  if (lastPage <= MAX_VISIBLE_PAGE_NUMBERS) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    const numMiddlePages = 3; // Number of pages directly around currentPage (e.g., C-1, C, C+1)
    const firstPage = 1;
    const lastNumPage = lastPage;

    // Pages near the beginning (1, 2, 3, 4, ..., lastPage)
    if (currentPage <= numMiddlePages) {
      for (let i = 1; i <= numMiddlePages + 1; i++) { // e.g., 1,2,3,4
        pages.push(i);
      }
      pages.push('...');
      pages.push(lastNumPage);
    }
    // Pages near the end (1, ..., lastPage-3, lastPage-2, lastPage-1, lastPage)
    else if (currentPage >= lastNumPage - numMiddlePages + 1) { // e.g., if lastPage=10, numMiddlePages=3, then 10-3+1=8. CP=8,9,10
      pages.push(firstPage);
      pages.push('...');
      for (let i = lastNumPage - (numMiddlePages + 1) + 1; i <= lastNumPage; i++) { // e.g., 10-4+1 = 7. 7,8,9,10
        pages.push(i);
      }
    }
    // Pages in the middle (1, ..., C-1, C, C+1, ..., lastPage)
    else {
      pages.push(firstPage);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(lastNumPage);
    }
  }
  return pages;
};

export default function Home() {

  const router = useRouter();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cardsData, setCardsData] = useState(crmCardsData);
  const [isUploading, setIsUploading] = useState(false);
  const [dataExists, setDataExists] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingData, setDeletingData] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const {user, isAuthenticated, isLoading} = useContext(AuthContext);

  authenticatePageUseEffect(isAuthenticated, isLoading, router);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data; // No search query, return original data
    }
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return data.filter(row =>
      Object.keys(row).some(key => {
        if (selectedColumns[key]) { // Only search in selected columns
          return String(row[key]).toLowerCase().includes(lowerCaseSearchQuery);
        }
        return false;
      })
    );
  }, [data, searchQuery, selectedColumns]);

  // Calculate last page for filtered data
  const filteredLastPage = useMemo(() => {
    return Math.ceil(totalCount / ITEMS_PER_PAGE);
  }, [totalCount]);

  const fetchData = useCallback(async (currentPage: number) => {
    
    setFetchingData(true);
    
    try {
      const response = await getDisplayTableData(currentPage); 
      
      setData(response.data.rows);
      setLastPage(response.data.lastPage);
      setTotalCount(response.data.totalCount);

      // Initialize selectedColumns if it's empty (first data load)
      if (Object.keys(selectedColumns).length === 0 && response.data.rows.length > 0) {
        const initialColumns: { [key: string]: boolean } = {};
        Object.keys(response.data.rows[0]).forEach(column => {
          initialColumns[column] = true;
        });
        setSelectedColumns(initialColumns);
      }

    } catch (error) {
      console.log(error);
    } finally{
      setFetchingData(false);
    }
  }, [selectedColumns]);

  useEffect(()=>{
    const initialCheck = async () => {
      try {

        if(!dataExists){
          const response = await checkTable();
          
          setDataExists(response.data.status);
  
          if(response.data.status == true){
            try{
              const response = await getDashboardDisplayCards();
              setCardsData(response.data);
  
              await fetchData(page);
            }catch(error){
              console.log(error);
            }
          }
        }else{
          await fetchData(page);
        }

        setIsChecking(false);
      }catch (error){
        console.log(error);
      }
    };
    initialCheck();
  }, [page, fetchData, selectedColumns])


  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      if (file.size <= 200 * 1024 * 1024) { // 200MB limit
        setIsUploading(true); // Set uploading to true
        const formData = new FormData();
        formData.append('data', file);
        
        try{
          const response = await uploadCSVData(formData);

          setCardsData(response.data);
          setDataExists(true); // Assuming successful upload means data now exists // Fetch first page after upload
          await fetchData(page); // Re-fetch data after successful upload
        }catch(error){
          console.log(error);
        }finally{
          setIsUploading(false); // Reset uploading state
        }

      } else {
        alert('File size exceeds 200MB limit.');
      }
    } else {
      alert('Only CSV files are supported.');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  async function deleteData(){
    setDeletingData(true);
    
    try{
      await deleteCSVData();
      setDataExists(false);
      setData([]);
      setCardsData({domain: "", missing_data_ratio: 0, num_numeric_columns: 0, total_columns: 0, total_rows: 0});
      setPage(1);
      setLastPage(1);
      setTotalCount(0);
      localStorage.clear();
    } finally{
      setDeletingData(false);
    }
  }

  if(!isAuthenticated){
    return (
      <CheckingUserCard/>
    )
  }else{
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="mx-auto max-w-7xl space-y-8"> 
          
          {/* header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-foreground">Display Page</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Upload and explore your CSV data with powerful analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg flex items-center justify-center">
                <Button disabled={deletingData || isUploading || isChecking} onClick={deleteData} className="bg-destructive hover:bg-destructive/90 hover:cursor-pointer">
                  {deletingData ? "Deleting..." : "Delete Data"}
                </Button>
              </div>
            </div>
          </div>
  
          {/* isChecking */}
          {isChecking && (
            <Card className="border-2 border-dashed border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:sync" className="w-10 h-10 text-primary-foreground animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Checking data status...</h3>
                    <p className="text-muted-foreground mb-4">
                      Please wait while we check for existing data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
  
          {/* isUploading  */}
          {(isUploading && !dataExists) && (
            <Card className="border-2 border-dashed border-primary bg-card/50 backdrop-blur-sm">
              <CardContent className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:cloud-upload" className="w-10 h-10 text-primary-foreground animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Uploading your CSV...</h3>
                    <p className="text-muted-foreground mb-4">
                      Please wait while your file is being processed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
  
          {/* data exists */}
          {(dataExists && !isChecking) && (
            <Card className="border-2 border-dashed border-primary bg-card/50 backdrop-blur-sm">
              <CardContent className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:check-circle" className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Data Already Exists</h3>
                    <p className="text-muted-foreground mb-4">
                      It looks like you already have data uploaded. You can proceed to explore.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
  
          {/* Upload card */}
          {!dataExists && !isUploading && !isChecking && <Card
            className={`border-2 border-dashed ${isDragOver ? 'border-primary bg-muted' : 'border-border'} hover:border-primary transition-colors duration-300 bg-card/50 backdrop-blur-sm`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <CardContent className="px-6 py-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Icon icon="material-symbols:cloud-upload" className="w-10 h-10 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Upload your CSV file</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <label className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  Choose File
                </label>
                <p className="text-sm text-muted-foreground">Supported formats: CSV files up to 200MB</p>
              </div>
            </CardContent>
          </Card>}
  
          
  
          {/* 4 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-card/70 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="px-6 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Icon icon="material-symbols:domain" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Domain</p>
                    <p className="text-xl font-bold text-foreground">{cardsData.domain}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="px-6 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                    <Icon icon="material-symbols:table-rows" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Rows</p>
                    <p className="text-xl font-bold text-foreground">{cardsData.total_rows}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="px-6 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                    <Icon icon="material-symbols:view-column" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Columns</p>
                    <p className="text-xl font-bold text-foreground">{cardsData.total_columns}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="px-6 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-destructive to-destructive/80 rounded-lg flex items-center justify-center">
                    <Icon icon="material-symbols:warning" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Missing Data</p>
                    <p className="text-xl font-bold text-foreground">{cardsData.missing_data_ratio}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="px-6 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Icon icon="material-symbols:numbers" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Numeric Columns</p>
                    <p className="text-xl font-bold text-foreground">{cardsData.num_numeric_columns}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
  
  
  
          {/* Table */}
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Data Explorer
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Advanced data exploration and insights platform
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="px-6 space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon
                      icon="material-symbols:search"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary"
                    />
                    <Input
                      className="pl-10 bg-input/80 backdrop-blur-sm border-border focus:border-primary focus:ring-primary/20 shadow-sm"
                      placeholder="Search across all columns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full lg:w-auto bg-input/80 backdrop-blur-sm border-border hover:bg-accent/10 hover:border-primary transition-all duration-300 shadow-sm"
                    >
                      <Icon
                        icon="material-symbols:view-column"
                        className="w-4 h-4 mr-2 text-primary"
                      />
                      Columns
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-64 bg-popover/95 backdrop-blur-sm border-border shadow-xl"
                  >
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-popover-foreground">Toggle Columns</h4>
                      <div className="space-y-2">
                        {Object.keys(selectedColumns).map((columnName) => (
                          <div key={columnName} className="flex items-center space-x-2">
                            <Checkbox
                              id={`col-${columnName}`}
                              checked={selectedColumns[columnName]}
                              onCheckedChange={(checked: boolean) => {
                                setSelectedColumns(prev => ({
                                  ...prev,
                                  [columnName]: Boolean(checked),
                                }));
                              }}
                            />
                            <Label htmlFor={`col-${columnName}`} className="text-sm">
                              {columnName}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="rounded-xl border border-border overflow-hidden shadow-lg bg-card/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/80 border-b border-border">
                      {filteredData.length > 0 && Object.keys(filteredData[0]).filter(feature => selectedColumns[feature]).map((feature)=>{
                        return (
                          <TableHead key={feature} className="font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {feature}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 && filteredData.map((record, rowIndex) => (
                      <TableRow key={rowIndex} className="hover:bg-accent/10 transition-all duration-300 border-b border-border">
                        {Object.keys(record).filter(feature => selectedColumns[feature]).map((feature, colIndex) => (
                          <TableCell key={colIndex} className="text-foreground">{String(record[feature])}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border border-border">
                {!deletingData && <Pagination hidden={fetchingData}>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className="hover:cursor-pointer hover:bg-accent/10 hover:border-primary transition-all duration-300"
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      />
                    </PaginationItem>
                    {getPaginationPages(page, filteredLastPage).map((p, index) => (
                      <PaginationItem key={index}>
                        {p === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => setPage(p as number)}
                            className="hover:cursor-pointer hover:bg-accent/10 transition-all duration-300"
                          >
                            {p}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className="hover:cursor-pointer hover:bg-accent/10 hover:border-primary transition-all duration-300"
                        onClick={() => setPage(prev => Math.min(filteredLastPage, prev + 1))}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>}
              </div>
            </CardContent>
          </Card>
  
  
          
        </div>
      </div>
    );
  }

}
